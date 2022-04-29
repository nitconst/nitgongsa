import React, {useState} from "react";
import { dbService } from "../fbase";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const [gongsa, setGongsa] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "gongsa"), {
         gongsa,
         createdAt: Date.now(),
       });
    //
    // dbService.collection("gongsa").add({
    //   gongsa,
    //   createdAt: Date.now(),
    // });
  
  setGongsa("");
};
  const onChange = (event) => {
    const {
      target : {value}
    } = event;
    setGongsa(value);

  }
  return(
    
    <div>
    {/* <Register/> //내용 옮기기
    <ReadGongsa/> */}
    
  <form onSubmit={onSubmit}>
    <input value={gongsa} onChange={onChange} type="text" placeholder="공사 내용 입력"/>
    <input type="submit" value="제출"/>
  </form>
</div>
);
};

export default Home;
