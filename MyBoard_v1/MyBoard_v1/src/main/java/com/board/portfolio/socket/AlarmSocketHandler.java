package com.board.portfolio.socket;

import com.board.portfolio.domain.entity.*;
import com.board.portfolio.exception.custom.NotAllowAccessException;
import com.board.portfolio.repository.AlarmRepository;
import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.security.jwt.JwtDecoder;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AlarmSocketHandler extends TextWebSocketHandler {

    private final Map<String, Object> httpSessions = new HashMap();
    private final BoardRepository boardRepository;
    private final AlarmRepository alarmRepository;
    private final JwtDecoder jwtDecoder;
    @Value("${jwt.token.name}")
    private String tokenName;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        String email = getEmailFromJWT(session);
        httpSessions.put(email, session);
    }
    private String getEmailFromJWT(WebSocketSession session){
        String[] cookieStrings = session.getHandshakeHeaders().get("cookie").get(0).split(";");

        String jwt="";

        for(String cookieString : cookieStrings){
            String[] strings = cookieString.split("=");
            if(tokenName.equals(strings[0].trim())){
                jwt = strings[1];
            }
        }
        if(jwt.equals("")){
            throw new NotAllowAccessException();
        }
        return jwtDecoder.decodeJwt(jwt).getClaims().get("email").asString();
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String email = getEmailFromJWT(session);
        httpSessions.remove(email);
    }

    @Transactional
    public void commentAlarmProcess(Board board, Account triggerAccount){
        Account targetAccount = board.getAccount();
        if(isNoAlarmPolicy(triggerAccount, targetAccount))
            return;

        Alarm alarm = Alarm.builder()
                .targetAccount(targetAccount)
                .triggerAccount(triggerAccount)
                .eventType(AlarmEventType.WRITE_COMMENT)
                .eventContentId(board.getBoardId().toString())
                .build();
        alarmRepository.save(alarm);

        JSONObject jsonObject = buildCommentJObject(board.getBoardId(), triggerAccount.getNickname());
        WebSocketSession session = (WebSocketSession)httpSessions.get(targetAccount.getEmail());
        if(session == null){
            return;
        }
        sendAlarm(jsonObject,session);
    }
    private JSONObject buildCommentJObject(Long boardId, String nickname){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("boardId", boardId);
        jsonObject.put("trigger", nickname);
        jsonObject.put("eventType", AlarmEventType.WRITE_COMMENT.toString());
        return jsonObject;
    }

    @Transactional
    public void replyCommentAlarmProcess(Comment parentComment, Account triggerAccount){
        if(!isSameAccount(parentComment)){
            commentAlarmProcess(parentComment.getBoard(), triggerAccount);
        }
        Account targetAccount = parentComment.getAccount();
        if(isNoAlarmPolicy(triggerAccount, targetAccount))
            return;

        Alarm alarm = Alarm.builder()
                .targetAccount(targetAccount)
                .triggerAccount(triggerAccount)
                .eventType(AlarmEventType.REPLY_COMMENT)
                .eventContentId(parentComment.getBoard().getBoardId().toString())
                .build();
        alarmRepository.save(alarm);

        Long boardId = parentComment.getBoard().getBoardId();
        String nickname = triggerAccount.getNickname();
        JSONObject jsonObject = buildReplyCommentJObject(boardId, nickname);

        WebSocketSession session = (WebSocketSession)httpSessions.get(targetAccount.getEmail());
        if(session == null){
            return;
        }
        sendAlarm(jsonObject,session);

    }
    private JSONObject buildReplyCommentJObject(Long boardId, String nickname){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("boardId", boardId);
        jsonObject.put("trigger", nickname);
        jsonObject.put("eventType", AlarmEventType.REPLY_COMMENT.toString());
        return jsonObject;
    }

    private void sendAlarm(JSONObject jsonObject, WebSocketSession session){
        try {
            session.sendMessage(new TextMessage(jsonObject.toJSONString()));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private boolean isNoAlarmPolicy(Account trigger, Account target){
        boolean state=false;
        if(target==null){
            state = true;
        }
        if(trigger.getEmail().equals(target.getEmail())){
            state = true;
        }
        return state;
    }

    private boolean isSameAccount(Comment parentComment){
        String commentEmail = parentComment.getAccount().getEmail();
        String boardEmail = parentComment.getBoard().getAccount().getEmail();
        return commentEmail.equals(boardEmail);
    }


}
