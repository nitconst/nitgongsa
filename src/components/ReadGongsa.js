import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  limit,
  onSnapshot,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { dbService } from "fbase";
import GongsaList from "./GongsaList";
import ExportExcel from "./ExportExcel";
import axios from "axios";

const backUrl = "http://127.0.0.1:8080/gongsa";

const ReadGongsa = ({ userObj, codeNum }) => {
  const [selectedItem, setSelectedItem] = useState("000");
  // regioncode2 : 정렬을 위한 state, 000은 전체, 001,002,003,004는 지역별
  const [isPc, setIsPC] = useState(false);
  const [queryObject, setQueryObject] = useState(
    query(
      collection(dbService, "gongsa"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  );
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let filter = "win16|win32|win64|mac|macintel";
    if (0 > filter.indexOf(navigator.platform.toLocaleLowerCase())) {
      setIsPC(false);
    } else {
      setIsPC(true);
    }
    getGongsaData();
  }, []);

  useEffect(() => {
    setPage(1);
    if (selectedItem === "000") {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          limit(5)
        )
      );
      getGongsaData();
    } else {
      if (
        selectedItem === "100" ||
        selectedItem === "200" ||
        selectedItem === "300" ||
        selectedItem === "400"
      ) {
        setQueryObject(
          query(
            collection(dbService, "gongsa"),
            orderBy("createdAt", "desc"),
            where("regioncode2", "==", selectedItem),
            limit(5)
          )
        );
      } else {
        setQueryObject(
          query(
            collection(dbService, "gongsa"),
            orderBy("createdAt", "desc"),
            where("regioncode", "==", selectedItem),
            limit(5)
          )
        );
      }
      getGongsaDataByRegion();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem === "000") getGongsaData();
    else getGongsaDataByRegion();
  }, [queryObject]);

  const getGongsaData = () => {
    const fetchData = async () => {
      const q = queryObject;
      console.log(q);
      const unsubscribe = await onSnapshot(q, (querySnapshot) => {
        let items = [];
        querySnapshot.forEach((doc) => {
          items.push({ key: doc.id, ...doc.data() });
        });
        setList(items);
      });
    };
    // const data = axios.get(backUrl);
    // console.log(data);

    fetchData();
  };

  const getGongsaDataByRegion = () => {
    const fetchData = async () => {
      const q = queryObject;
      const unsubscribe = await onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ key: doc.id, ...doc.data() });
        });

        setList(items);
      });
    };
    fetchData();
  };

  const showNext = ({ item }) => {
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
          orderBy("createdAt", "desc"),
          where("regioncode2", "==", selectedItem),
          limit(5),
          startAfter(item.createdAt)
        )
      );
    } else if (selectedItem === "000") {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          limit(5),
          startAfter(item.createdAt)
        )
      );
    } else {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          where("regioncode", "==", selectedItem),
          limit(5),
          startAfter(item.createdAt)
        )
      );
    }
    if (list.length === 0) {
      alert("Thats all we have for now !");
    } else {
      const fetchNextData = () => {
        const q = queryObject;
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ key: doc.id, ...doc.data() });
          });
          setList(items);
          setPage(page + 1);
        });
      };
      fetchNextData();
    }
  };

  const showPrevious = ({ item }) => {
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
          orderBy("createdAt", "desc"),
          where("regioncode2", "==", selectedItem),
          endBefore(item.createdAt),
          limitToLast(5)
        )
      );
    } else if (selectedItem === "000") {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          limit(5),
          endBefore(item.createdAt),
          limitToLast(5)
        )
      );
    } else {
      setQueryObject(
        query(
          collection(dbService, "gongsa"),
          orderBy("createdAt", "desc"),
          where("regioncode", "==", selectedItem),
          limit(5),
          endBefore(item.createdAt),
          limitToLast(5)
        )
      );
    }
    const fetchPreviousData = () => {
      const q = queryObject;
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ key: doc.id, ...doc.data() });
        });
        setList(items);
        setPage(page - 1);
      });
    };
    fetchPreviousData();
  };

  const onChangeHandler = (e) => {
    setSelectedItem(e.currentTarget.value);
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
        {list.map((gongsa) => (
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
              page === 1 ? (
                ""
              ) : (
                <button
                  className="button is-small is-rounded is-link"
                  onClick={() => showPrevious({ item: list[0] })}
                >
                  이전
                </button>
              )
            }
          </p>
          <p className="control">
            {
              //show next button only when we have items
              list.length < 5 ? (
                ""
              ) : (
                <button
                  className="button is-small is-rounded is-link"
                  onClick={() => showNext({ item: list[list.length - 1] })}
                >
                  다음
                </button>
              )
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadGongsa;
