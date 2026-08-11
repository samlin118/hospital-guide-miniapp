function createOrder(orderNo, amount, openid) {
  return {
    success: true,
    prepayId: 'wx' + Date.now(),
    nonceStr: 'mock',
    paySign: 'mock_sign',
  };
}

function queryOrder(orderNo) {
  return { trade_state: 'SUCCESS' };
}

function refund(orderNo, amount) {
  return { success: true };
}

module.exports = { createOrder, queryOrder, refund };
