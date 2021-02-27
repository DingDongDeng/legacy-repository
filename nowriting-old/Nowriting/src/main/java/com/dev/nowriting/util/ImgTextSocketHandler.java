package com.dev.nowriting.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ImgTextSocketHandler extends TextWebSocketHandler {
	private Map<String, Object> httpSessions = new HashMap<String,Object>();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// TODO Auto-generated method stub
//		super.afterConnectionEstablished(session);
		Map<String, Object> httpSession = session.getAttributes();
		
		String mail = (String) httpSession.get("mail");
		String task = (String) httpSession.get("task");
		httpSessions.put(mail+"_"+task, session);
		
		System.out.println("소켓이 연결되었습니다");
		System.out.println("소켓에서 확인한 아이디 : " + mail+"_"+task);
		
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		String msg = message.getPayload();
		Map<String, Object> httpSession = session.getAttributes();
		String mail = (String) httpSession.get("mail");
		String task = (String) httpSession.get("task");

		if(task.equals("camera")) {//다른타입의 업무는 소켓통신을 못하게 필터함
			WebSocketSession pcSession = (WebSocketSession)httpSessions.get(mail+"_"+"pc");
			if(pcSession==null) { 
				WebSocketSession cameraSession = (WebSocketSession)httpSessions.get(mail+"_"+"camera");
				msg = "사진(이미지)에서 추출한 문자를 전송할 PC가 발견되지 않았습니다.\n" 
					+ "PC화면 : 프로젝트 리스트 -> 페이지 편집화면 \n"
					+ "편집화면이 준비되어야 추출한 문자를 전송할 수 있습니다.";
				TextMessage textMessage = new TextMessage(msg);
				cameraSession.sendMessage(textMessage);
				return;
			}
			TextMessage textMessage = new TextMessage(msg);
			pcSession.sendMessage(textMessage);
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		
		Map<String, Object> httpSession = session.getAttributes();
		
		String mail = (String) httpSession.get("mail");
		String task = (String) httpSession.get("task");
		httpSessions.remove(mail+"_"+task);
	}
}
