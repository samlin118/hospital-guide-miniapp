function createOrder(orderNo, amount, subject) {
  return {
    success: true,
    tradeNo: 'alipay' + Date.now(),
    payUrl: 'https://mock-alipay.com/pay?orderNo=' + orderNo + '&amount=' + amount,
  };
}

function queryOrder(tradeNo) {
  return { trade_status: 'TRADE_SUCCESS' };
}

module.exports = { createOrder, queryOrder };
