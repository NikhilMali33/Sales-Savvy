package com.salessavvy.app.services;

import com.salessavvy.app.dto.response.PaymentOrderResponseDTO;

public interface PaymentService {
	
	PaymentOrderResponseDTO createRazorpayOrder(String orderId);
	
	
	void verifyPayment(
            String orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    );
	

}
