package com.dev.nowriting.api;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import com.google.api.client.util.Lists;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Feature.Type;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;

public class GoogleCloudVisionApiTester {
	
	public static void main(String[] args) {
		try {
//			String imageFilePath = "..\\..\\..\\..\\..\\..\\..\\src\\main\\webapp\\resources\\img\\sample.jpg"; //여기 설정해줘야함(test이미지 경로)
//			String imageFilePath = "../../../../../webapp/resources/img/sample.jpg"; //여기 설정해줘야함(test이미지 경로)
//			String imageFilePath = "..\\..\\..\\..\\..\\webapp\\resources\\img\\sample.jpg"; //여기 설정해줘야함(test이미지 경로)
			String imageFilePath = "C:\\Users\\etea5\\Desktop\\Spring file store\\sample.jpg"; 
			
			List<AnnotateImageRequest> requests = new ArrayList<AnnotateImageRequest>();
		
			ByteString imgBytes = ByteString.readFrom(new FileInputStream(imageFilePath));
		
			Image img = Image.newBuilder().setContent(imgBytes).build();//
			Feature feat = Feature.newBuilder().setType(Type.TEXT_DETECTION).build();
			AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
			requests.add(request);
			
			
			try {
				ImageAnnotatorClient client;
				client = ImageAnnotatorClient.create();
				BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
			    List<AnnotateImageResponse> responses = response.getResponsesList();
		
			    for (AnnotateImageResponse res : responses) {
			    	if (res.hasError()) {
			    		System.out.printf("Error: %s\n", res.getError().getMessage());
			    		return;
			    	}
		
			    	System.out.println("Text : ");
			    	System.out.println(res.getTextAnnotationsList().get(0).getDescription());
			      
			    	// For full list of available annotations, see http://g.co/cloud/vision/docs
			    	/*for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
				    	  
						//System.out.printf("Text: %s\n", annotation.getDescription());
						//System.out.printf("Position : %s\n", annotation.getBoundingPoly());
					}*/
			    }
			}
			catch(Exception e1){
				e1.printStackTrace();
			}
		} catch(Exception e2) {
			e2.printStackTrace();
		}
	}
}
