import { defaultInstance } from "apis/utils";

export const getPost = async (param) => {
  try {
    let items = [];
    await defaultInstance("", {
      params: param,
    }).then((result) => {
      result.data.forEach((doc) => {
        items.push({ key: doc._id, ...doc });
      });
    });
    return items;
  } catch (err) {
    console.log(err);
  }
};

export const postCreate = async (param) => {
  try {
    await defaultInstance.post("", { params: param });
  } catch (err) {
    console.log(err);
  }
};
