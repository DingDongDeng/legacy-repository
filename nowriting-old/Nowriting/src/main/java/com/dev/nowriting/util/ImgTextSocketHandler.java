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
		
		System.out.println("������ ����Ǿ����ϴ�");
		System.out.println("���Ͽ��� Ȯ���� ���̵� : " + mail+"_"+task);
		
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		String msg = message.getPayload();
		Map<String, Object> httpSession = session.getAttributes();
		String mail = (String) httpSession.get("mail");
		String task = (String) httpSession.get("task");

		if(task.equals("camera")) {//�ٸ�Ÿ���� ������ ��������� ���ϰ� ������
			WebSocketSession pcSession = (WebSocketSession)httpSessions.get(mail+"_"+"pc");
			if(pcSession==null) { 
				WebSocketSession cameraSession = (WebSocketSession)httpSessions.get(mail+"_"+"camera");
				msg = "����(�̹���)���� ������ ���ڸ� ������ PC�� �߰ߵ��� �ʾҽ��ϴ�.\n" 
					+ "PCȭ�� : ������Ʈ ����Ʈ -> ������ ����ȭ�� \n"
					+ "����ȭ���� �غ�Ǿ�� ������ ���ڸ� ������ �� �ֽ��ϴ�.";
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
