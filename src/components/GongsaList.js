import React, { useEffect, useState } from "react";
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

const Img = styled.img`
  height: 100px;
  width: 60%;
  border: none;
`;

const GongsaList = ({ gongsaObj, isOwner, userObj }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textEdit, setTextEdit] = useState(gongsaObj.text);
  const [attachment, setAttachment] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [selectedItem, setSelectedItem] = useState(gongsaObj.code);
  const [docKey, setDocKey] = useState("");

  const code = [
    { code: "0", status: "신고" },
    { code: "1", status: "처리 중" },
    { code: "2", status: "조치완료" },
  ];

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
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  //업데이트 기능
  const handleSubmit = async (key) => {
    let attachmentUrl = "";
    if (attachment !== "") {
      await deleteObject(ref(storageService, gongsaObj.attachmentUrl));
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
      await updateDoc(doc(dbService, "gongsa", key), {
        text: textEdit,
        code: Number(selectedItem),
        attachmentUrl: attachmentUrl,
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
                  value={gongsaObj.addr}
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
                        <i className="fa-solid fa-lg fa-angle-down" />
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lg fa-angle-right" />
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
                            <i className="fa-solid fa-angle-down" />
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-angle-right" />
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
  );
};

export default GongsaList;
