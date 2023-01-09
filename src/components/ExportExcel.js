import React, { useEffect, useState } from "react";
import ReactExport from "react-export-excel";
import axios from "axios";

const backUrl = process.env.REACT_APP_BACKEND_URL_EXCEL;

const ExportExcel = ({ selectedItem }) => {
  const [gongsaList, setGongsaList] = useState([]);
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {
    getGongsaList();
  }, [selectedItem]);

  const getGongsaList = async () => {
    let q = {};
    const querySnapshotArray = [];

    if (
      selectedItem === "100" ||
      selectedItem === "200" ||
      selectedItem === "300" ||
      selectedItem === "400"
    ) {
      // const str = selectedItem.charAt(0);
      // const q = query(
      //   collection(dbService, "gongsa"),
      //   orderBy("regioncode"),
      //   orderBy("createdAt", "desc"),
      //   startAt(str),
      //   endAt(str + "\uf8ff")
      // );

      // const querySnapshot = await getDocs(q);
      // const querySnapshotArray = [];
      // querySnapshot.forEach((doc) => {
      //   querySnapshotArray.push(doc.data());
      // });
      // setGongsaList(querySnapshotArray);

      q = { queryType: "1", regioncode2: selectedItem };
    } else if (selectedItem === "000") {
      // const q = query(collection(dbService, "gongsa"));

      // const querySnapshot = await getDocs(q);

      // const querySnapshotArray = [];
      // querySnapshot.forEach((doc) => {
      //   console.log(doc.data());
      //   querySnapshotArray.push(doc.data());
      // });
      // setGongsaList(querySnapshotArray);

      q = { queryType: "0" };
    } else {
      //   const q = query(
      //     collection(dbService, "gongsa"),
      //     where("regioncode", "==", selectedItem)
      //   );

      //   const querySnapshot = await getDocs(q);
      //   const querySnapshotArray = [];
      //   querySnapshot.forEach((doc) => {
      //     querySnapshotArray.push(doc.data());
      //   });
      //   setGongsaList(querySnapshotArray);

      q = { queryType: "2", regioncode: selectedItem };
    }
    await axios.get(backUrl, { params: q }).then((res) => {
      const querySnapshot = res.data;

      querySnapshot.forEach((doc) => {
        querySnapshotArray.push(doc);
      });
      setGongsaList(querySnapshotArray);
    });
  };
  return (
    <ExcelFile
      element={
        <button className="button is-success is-small is-rounded">
          <span className="icon is-small">
            <i className="fas fa-file-excel"></i>
          </span>
          <span>엑셀</span>
        </button>
      }
    >
      {gongsaList.length !== 0 ? (
        <ExcelSheet data={gongsaList} name="Data">
          <ExcelColumn label="신고자 번호" value="phone" />
          <ExcelColumn label="주소" value="addr" />
          <ExcelColumn label="시간" value="createdAt" />
        </ExcelSheet>
      ) : (
        <></>
      )}
    </ExcelFile>
  );
};

export default ExportExcel;
