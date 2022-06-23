import React, { useRef, useEffect, useState } from "react";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import styled from "styled-components";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import GongsaStatus from "./GongsaStatus";
import Geocode from "react-geocode";
import EXIF from "exif-js";
import imageCompression from "browser-image-compression";
import Lottie from "react-lottie";
import loadingAnimationData from "lotties/loading-construction.json";

Geocode.setApiKey("AIzaSyBIWmLYzIJmYLxLoRsHchr0OAErLWpKcyI");
Geocode.setLanguage("ko");
Geocode.setRegion("kr");
Geocode.enableDebug();

const Img = styled.img`
  height: 100px;
  width: 60%;
  border: none;
`;

const GongsaList = ({ gongsaObj, isOwner, userObj, codeNum }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textEdit, setTextEdit] = useState(gongsaObj.text);
  const [attachment, setAttachment] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [selectedItem, setSelectedItem] = useState(gongsaObj.code);
  const [docKey, setDocKey] = useState("");
  const [date, setDate] = useState(""); //시각
  const [GPSla, setGPSLa] = useState([]); //위도
  const [GPSlong, setGPSLong] = useState([]); //경도
  const [address, setAddress] = useState(gongsaObj.addr); //주소변환
  const [arr, setArr] = useState(gongsaObj.addr.split(" ")); //지역변환
  const meta = useRef(null);
  const [load, setLoad] = useState(true);

  const code = [
    { code: "0", status: "신고" },
    { code: "1", status: "처리 중" },
    { code: "2", status: "조치완료" },
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //주소변환함수
  const setFileData = (a, b) => {
    Geocode.fromLatLng(String(a), String(b)).then(
      (response) => {
        //대한민국 제외 주소 DB 저장
        setAddress(response.results[0].formatted_address.substr(5));
        let city, state, country;
        // let add = response.results[0].formatted_address;
        // let result = add.substr(5);
        // console.log(result);
        for (const element of response.results[0].address_components) {
          for (let j = 0; j < element.types.length; j++) {
            switch (element.types[j]) {
              case "locality":
                city = element.long_name;
                break;
              case "administrative_area_level_1":
                state = element.long_name;
                break;
              case "country":
                country = element.long_name;
                break;
            }
          }
        }

        //배열에 공백 단위로 주소 나눠넣기
        setArr(response.results[0].formatted_address.split(" "));
      },
      (error) => {
        console.error(error);
      }
    );
  };
  //삭제 기능
  const handleCancle = async (key, index) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(doc(dbService, "gongsa", key));
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      window.location.reload();
    }
  };

  //수정 기능
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTextEdit(value);
  };

  const handleFileChange = async (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    //resize 함수 작성
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(theFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(compressedFile);
      meta.current = compressedFile;
    } catch (error) {}

    //메타데이터 추출
    if (theFile && theFile.name) {
      EXIF.getData(theFile, function () {
        let exifData = EXIF.pretty(this);
        let gpsLa = EXIF.getTag(this, "GPSLatitude");
        let gpsLaRef = EXIF.getTag(this, "GPSLatitudeRef");
        let gpsLong = EXIF.getTag(this, "GPSLongitude");
        let gpsLongRef = EXIF.getTag(this, "GPSLongitudeRef");

        let la = [];
        let long = [];

        //위경도 api 연동 변수
        let a = "";
        let b = "";

        if (gpsLa) {
          //exifdata 존재 시 gps 계산 수행pl
          for (let i = 0; i < gpsLa.length; i++) {
            la[i] = gpsLa[i].numerator / gpsLa[i].denominator;
          }
          for (let i = 0; i < gpsLong.length; i++) {
            long[i] = gpsLong[i].numerator / gpsLong[i].denominator;
          }

          //사진 시각 정보 설정
          const dateFirst = EXIF.getTag(this, "DateTime")
            .split(" ")[0]
            .replaceAll(":", "-");
          const dateLast = EXIF.getTag(this, "DateTime")
            .split(" ")[1]
            .substring(-1, 5);
          setDate(dateFirst + " " + dateLast);

          //ref 조건 별 위경도 계산
          if (gpsLaRef == "N") {
            a =
              parseInt(la[0]) +
              (60 * parseInt(la[1]) + parseFloat(la[2])) / 3600;
          } else {
            a =
              -1 * parseInt(la[0]) +
              (-60 * parseInt(la[1]) + -1 * parseFloat(la[2])) / 3600;
          }
          setGPSLa(a);

          if (gpsLongRef == "E") {
            b =
              parseInt(long[0]) +
              (60 * parseInt(long[1]) + parseFloat(long[2])) / 3600;
          } else {
            b =
              -1 * parseInt(long[0]) +
              (-60 * parseInt(long[1]) + -1 * parseFloat(long[2])) / 3600;
          }
          setGPSLong(b);
        } else {
          alert(
            "[오류] 사진의 위치정보가 존재하지 않습니다.\n\n ㅇ 위치기반 재촬영 방법 \n Android : 1. 설정>위치>사용 활성화 \n 2. 카메라>좌측 톱니바퀴 아이콘>위치 태그 활성화 \n iOS : 설정>카메라>포맷>높은 호환성>재촬영 후 사진 보관함에서 사진 선택"
          );
          window.location.reload();
        }
        //위경도 기반 주소변환 실행
        setFileData(a, b);
      });
    }
    console.log(gongsaObj);
  };

  //업데이트 기능
  const handleSubmit = async (key) => {
    setLoad(false);
    let attachmentUrl = "";
    if (attachment !== "" || address !== "") {
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl);

      let test = codeNum.find((codeNum) => {
        console.log(codeNum);
        return codeNum.region === arr[2];
      });
      console.log(test);

      if (test == undefined) {
        test = {
          code: "999",
          region: "기타",
        };
      }

      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
        createdAt: date,
        GPSLatitude: GPSla,
        GPSLongitude: GPSlong,
        addr: address,
        docKey: key,
        attachmentUrl: attachmentUrl,
        code: selectedItem,
        regioncode: test.code,
      });
    } else if (attachment === "") {
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
        code: Number(selectedItem),
      });
    }

    window.location.reload();
  };

  const onChangeHandler = (e, key) => {
    setSelectedItem(e.currentTarget.value);
    // select name이 detail인 경우 (모든 유저가 처리상태 수정하기 위한 부분)
    if (e.target.name === "detail") {
      setDocKey(gongsaObj.docKey);
    }
  };

  // 처리상태 select값 바뀔 때 effect
  useEffect(() => {
    // detail인 경우만 처리상태 바로 수정, 아닌 경우는 수정버튼 눌렀을때 수정(handleSubmit 참조)
    if (isDetail) {
      codeModifying(docKey);
    }
  }, [selectedItem, docKey]);

  // 처리상태 코드만 수정하는 부분
  const codeModifying = async (key) => {
    await updateDoc(doc(dbService, "gongsa", key), {
      code: Number(selectedItem),
    });
  };
  const toggleEditing = () => setIsEditing((prev) => !prev);
  const toggleDetail = () => setIsDetail((prev) => !prev);

  return (
    <>
      {load ? (
        <div>
          {isEditing ? (
            <>
              <div className="box edit-box">
                <div className="field">
                  <label className="label">공사사진</label>
                  <div>
                    {attachment ? (
                      <>
                        <img src={attachment} className="reg-temp-img" alt="" />
                      </>
                    ) : (
                      <>
                        <img
                          src={gongsaObj.attachmentUrl}
                          className="reg-temp-img"
                          alt=""
                        />
                      </>
                    )}
                  </div>
                  <label htmlFor="edit-file" className="imgLabel">
                    <span>사진 변경 </span>
                    <span className="icon">
                      <i className="fas fa-edit"></i>
                    </span>
                  </label>
                  <input
                    id="edit-file"
                    className="img-hide"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="field">
                  <label className="label">주소</label>
                  <div className="control has-icons-left has-icons-right">
                    <input
                      className="input is-small"
                      type="text"
                      placeholder="Text input"
                      value={address}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-addr"></i>
                    </span>
                    <span className="icon is-small is-right">
                      <i className="fas fa-check"></i>
                    </span>
                  </div>
                  <p className="help is-success is-small">
                    주소는 사진에 저장된 위치데이터 기반으로 자동생성됩니다.
                  </p>
                </div>
                <div className="field">
                  <label className="label">처리상태</label>
                  <div className="control">
                    <div className="select is-small">
                      <select
                        value={selectedItem}
                        onChange={(e) => onChangeHandler(e, gongsaObj.docKey)}
                      >
                        {code.map((item, index) => (
                          <option key={item.code} value={item.code}>
                            {item.status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">공사메모</label>
                  <div className="control">
                    <textarea
                      className="textarea is-small"
                      placeholder="공사메모 입력"
                      onChange={onChange}
                      value={textEdit}
                    ></textarea>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className="button is-link is-rounded"
                      onClick={() => {
                        handleSubmit(gongsaObj.docKey);
                      }}
                    >
                      수정
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-link is-rounded is-light"
                      onClick={toggleEditing}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ) : (
            <>
              <article className="media">
                {isDetail ? (
                  <div className="content is-small content-detail">
                    <div className="div-arrow" onClick={toggleDetail}>
                      <span className="icon">
                        {isDetail ? (
                          <>
                            <i className="fas fa-angle-down" />
                          </>
                        ) : (
                          <>
                            <i className="fas fa-angle-right"></i>
                          </>
                        )}
                      </span>
                    </div>
                    <h4>공사사진</h4>
                    <img src={gongsaObj.attachmentUrl} alt="" />
                    <h4>주소</h4>
                    <p>{gongsaObj.addr}</p>
                    <h4>처리상태</h4>

                    <div className="control">
                      <div className="select is-small">
                        <select
                          value={selectedItem}
                          name="detail"
                          onChange={(e) => onChangeHandler(e, gongsaObj.docKey)}
                        >
                          {code.map((item, index) => (
                            <option key={item.code} value={item.code}>
                              {item.status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <h4>공사메모</h4>
                    <p>{gongsaObj.text}</p>
                  </div>
                ) : (
                  <>
                    <figure className="media-left">
                      <GongsaStatus gongsaObj={gongsaObj} />
                    </figure>
                    <div className="media-content">
                      <div className="content content-gongsa">
                        <p>
                          <strong>{gongsaObj.addr}</strong>
                        </p>
                        <div className="div-arrow" onClick={toggleDetail}>
                          <span className="icon">
                            {isDetail ? (
                              <>
                                <i className="fas fa-angle-down" />
                              </>
                            ) : (
                              <>
                                <i className="fas fa-angle-right" />
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      {isOwner ? (
                        <>
                          <nav className="level is-mobile">
                            <div className="level-left">
                              <a className="level-item">
                                <span className="icon is-small">
                                  <i
                                    className="fas fa-lg fa-edit"
                                    onClick={toggleEditing}
                                  ></i>
                                </span>
                              </a>
                              <a className="level-item">
                                <span className="icon is-small">
                                  <i
                                    className="fas fa-lg fa-trash"
                                    onClick={() => {
                                      handleCancle(gongsaObj.docKey);
                                    }}
                                  ></i>
                                </span>
                              </a>
                            </div>
                            <div className="level-right">
                              <div className="level-item">
                                <label className="checkbox">
                                  <small className="time-small">
                                    {gongsaObj.createdAt}
                                  </small>
                                </label>
                              </div>
                            </div>
                          </nav>
                        </>
                      ) : (
                        <nav className="level is-mobile">
                          <div className="level-left"></div>
                          <div className="level-right">
                            <div className="level-item">
                              <label className="checkbox">
                                <small className="time-small">
                                  {gongsaObj.createdAt}
                                </small>
                              </label>
                            </div>
                          </div>
                        </nav>
                      )}
                    </div>
                  </>
                )}
              </article>
              <hr />
            </>
          )}
        </div>
      ) : (
        <div className="auth-container">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
    </>
  );
};

export default GongsaList;
