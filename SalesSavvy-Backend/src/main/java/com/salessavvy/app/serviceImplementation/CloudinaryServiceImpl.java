package com.salessavvy.app.serviceImplementation;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.salessavvy.app.services.CloudinaryService;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
	
	private static final Logger logger = LoggerFactory.getLogger(CloudinaryServiceImpl.class);

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {

    	logger.info("Uploading file to Cloudinary: {}", file.getOriginalFilename());

    	Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

    	logger.info("Cloudinary upload successful: publicId={}, url={}",
    	        result.get("public_id"), result.get("secure_url"));

        return result;
    }

    @Override
    public void deleteImage(String publicId) throws IOException {

        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
        );
    }
}