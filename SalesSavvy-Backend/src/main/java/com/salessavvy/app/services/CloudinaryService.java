package com.salessavvy.app.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    Map<String, Object> uploadImage(MultipartFile file) throws IOException;

    void deleteImage(String publicId) throws IOException;

}