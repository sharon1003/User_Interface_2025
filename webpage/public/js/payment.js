document.addEventListener("DOMContentLoaded", function () {
  const payButton = document.getElementById("payButton");
  const totalAmountElement = document.getElementById("total-amount");
  const orderListElement = document.getElementById("order-list");

  payButton.addEventListener("click", function () {
      // 获取当前总金额
      let totalAmount = totalAmountElement.textContent || "0kr";

      // 检查是否需要支付
      if (parseFloat(totalAmount) > 0) {
          // 弹出支付成功提示
          alert("您已成功完成支付");

          // 清空总金额
          totalAmountElement.textContent = "0kr";

          // 清空订单列表
          orderListElement.innerHTML = "";
      } else {
          alert("当前无订单可支付！");
      }
  });
});
