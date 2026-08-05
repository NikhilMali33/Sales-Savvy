package com.salessavvy.app.serviceImplementation;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.salessavvy.app.services.CloudinaryService;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {

        System.out.println("Uploading to Cloudinary...");

        Map<String, Object> result =
                cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        System.out.println(result);

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