const PAYSTACK_LINKS = {
    10000: 'https://paystack.shop/pay/10fotiamonthly',
    20000: 'https://paystack.shop/pay/20fotiamonthly',
    50000: 'https://paystack.shop/pay/50fotiamonthly',
    100000: 'https://paystack.shop/pay/100fotiamonthly',
};

const PAYSTACK_FLEXIBLE_LINK = 'https://paystack.shop/pay/fotiamonthly';

export function getPaystackLink(amount) {
    const numericAmount = parseInt(amount, 10);
    return PAYSTACK_LINKS[numericAmount] || PAYSTACK_FLEXIBLE_LINK;
}

export function isPresetAmount(amount) {
    const numericAmount = parseInt(amount, 10);
    return Object.keys(PAYSTACK_LINKS).includes(String(numericAmount));
}
