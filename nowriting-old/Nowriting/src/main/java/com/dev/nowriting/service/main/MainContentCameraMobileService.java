package com.dev.nowriting.service.main;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.nowriting.api.GoogleCloudVisionApi;
@Service
public class MainContentCameraMobileService implements MainService {
	
	@Autowired
	GoogleCloudVisionApi gcv;
	
	@Override
	public void execute(Map result) {
		String img_ = (String) result.get("file");
		String content = new GoogleCloudVisionApi().detectText(img_);		
		result.put("content", content);
	}

}
