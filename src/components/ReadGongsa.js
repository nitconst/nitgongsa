import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { dbService } from "fbase";
import GongsaList from "./GongsaList";
import { usePagination } from "use-pagination-firestore";
import ExportExcel from "./ExportExcel";

const ReadGongsa = ({ userObj, codeNum }) => {
  const [selectedItem, setSelectedItem] = useState("000");
  const [isPc, setIsPC] = useState(false);
  // const [firstVisible, setFirstVisible] = useState(null);
  const [queryObject, setQueryObject] = useState(
    query(collection(dbService, "gongsa"), orderBy("createdAt", "desc"))
  );

  // usePagination 활용 페이지 구현 페이지당 5개씩
  const { items, isLoading, isStart, isEnd, getPrev, getNext } = usePagination(
    queryObject,
    {
      limit: 5,
    }
  );
  //firestore data 호출
  useEffect(() => {
    getGongsaData();
    let filter = "win16|win32|win64|mac|macintel";
    if (0 > filter.indexOf(navigator.platform.toLocaleLowerCase())) {
      setIsPC(false);
    } else {
      setIsPC(true);
    }
  }, []);

  useEffect(() => {
    if (selectedItem === "000") getGongsaData();
    else getGongsaDataByRegion();
  }, [selectedItem]);

  const getGongsaData = () => {
    setQueryObject(
      query(collection(dbService, "gongsa"), orderBy("createdAt", "desc"))
    );
  };

  const onChangeHandler = (e) => {
    setSelectedItem(e.currentTarget.value);
  };

  const getGongsaDataByRegion = async () => {
    if (
      selectedItem === "100" ||
      selectedItem === "200" ||
      selectedItem === "300" ||
      selectedItem === "400"
    ) {
      const str = selectedItem.charAt(0);
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("regioncode"),
          orderBy("createdAt", "desc"),
          startAt(str),
          endAt(str + "\uf8ff")
        )
      );
    } else {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          where("regioncode", "==", selectedItem)
        )
      );
    }
  };

  //firestore data 표시
  return (
    <div className="content">
      <div className="boxForm box">
        <div className="box-header">
          <span className="icon">
            <i className="fas fa-list is-large"></i>
          </span>
          <p className="box-header-text">공사신고 리스트</p>
        </div>
        <div className="select select-region">
          <>{isPc && <ExportExcel selectedItem={selectedItem} />}</>
          <select value={selectedItem} onChange={(e) => onChangeHandler(e)}>
            {codeNum.map((item, index) => (
              <option key={item.code} value={item.code}>
                {item.region}
              </option>
            ))}
          </select>
        </div>
        <hr className="hr-main" />
        {items.map((gongsa) => (
          <GongsaList
            gongsaObj={gongsa}
            key={gongsa.docKey}
            userObj={userObj}
            codeNum={codeNum}
            isOwner={gongsa.createdId === userObj.uid}
          />
        ))}
        <div className="field is-grouped is-grouped-centered">
          <p className="control">
            {
              //show previous button only when we have items

              <button
                className="button is-small is-rounded is-link"
                onClick={() => getPrev()}
                disabled={isStart}
              >
                이전
              </button>
            }
          </p>
          <p className="control">
            {
              //show next button only when we have items
              <button
                className="button is-small is-rounded is-link"
                onClick={() => getNext()}
                disabled={isEnd}
              >
                다음
              </button>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadGongsa;
