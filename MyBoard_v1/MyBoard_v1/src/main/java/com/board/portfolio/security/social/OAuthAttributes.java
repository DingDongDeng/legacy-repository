package com.board.portfolio.security.social;

import lombok.Getter;

import java.util.Map;

import static com.board.portfolio.util.StaticUtils.objectMapper;

@Getter
public class OAuthAttributes {
    private String serviceName;
    private Map<String,Object> attributes;
    private String email;

    public OAuthAttributes(String serviceName, Map<String, Object> attributes) {
        this.serviceName = serviceName;
        this.attributes = attributes;

        if(serviceName.equals("naver")){
            OfNaver(attributes);
        }
        if(serviceName.equals("google")){
            OfGoogle(attributes);
        }

        if(serviceName.equals("kakao")){
            OfKakao(attributes);
        }
    }

    private void OfNaver(Map attributes){
        Map response = (Map)attributes.get("response");
        this.email = response.get("email").toString();
    }

    private void OfGoogle(Map attributes){
        this.email = attributes.get("email").toString();
    }

    private void OfKakao(Map<String, Object> attributes) {
        this.email = objectMapper.convertValue(attributes.get("kakao_account"),Map.class).get("email").toString();
    }

}
