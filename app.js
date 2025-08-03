// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

const checkoutFormModal = document.getElementById('checkoutFormModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    cartModal.classList.remove('active');
    checkoutFormModal.classList.add('active');
});

closeCheckout.addEventListener('click', () => {
    checkoutFormModal.classList.remove('active');
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(checkoutForm);
    const orderDetails = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        address: formData.get('address'),
        pincode: formData.get('pincode'),
        payment: formData.get('payment'),
        cart: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    };

    // Show order summary
    alert(`Order Placed Successfully!\n\nThank you, ${orderDetails.name}!\nYour order of $${orderDetails.total} will be delivered to:\n${orderDetails.address}, ${orderDetails.pincode}\nPayment Mode: ${orderDetails.payment}`);
    
    cart = [];
    saveCart();
    updateCartUI();
    checkoutFormModal.classList.remove('active');
    checkoutForm.reset();
});
