import $ from "jquery";

const directSMS = ({ arr }) => {
  const url = "https://www.nit-api.shop:5026/insert_sms_submit_ajax.php";
  const phoneNumber = "01073331262";

  const smsWaitingText =
    `[웨이팅 접수]\n` +
    // `방문해 주셔서 감사합니다.\n` +
    `웨이팅이 정상적으로 접수되었습니다.(링크 참조)\n`;
  // `입장 순서가 되면 안내해 드리겠습니다.(링크 참조)`;
  console.log(arr);
  if (arr) {
    arr.forEach((element) => {
      console.log(element);
      $.ajax({
        url: url,
        method: "POST",
        data: {
          phone: element,
          smsbody: smsWaitingText,
        },
        error: function (request, status, error) {
          //   alert(
          //     "code:" +
          //       request.status +
          //       "\n" +
          //       "message:" +
          //       request.responseText +
          //       "\n" +
          //       "error:" +
          //       error
          //   );
          console.log(request.status, request.responseText, error);
        },
      });
    });
  }
};

export default directSMS;
