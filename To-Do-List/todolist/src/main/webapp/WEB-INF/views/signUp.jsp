<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<link href="https://fonts.googleapis.com/css?family=Baloo+Bhai|Do+Hyeon&display=swap" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/signUp.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/background.css">
</head>
<body>
	<!-- 비동기 동작시 대기화면 생성 -->
	<jsp:include page="waiting.jsp" flush="false"/>	
	<div class="signUpPage">
		<div class="title">
			<h1>Sign Up</h1>
		</div>
		<div class="inputUI">
			<div class="userInfo">
				<div>
					<input type="text" name="mail" placeholder="이메일">
				</div>
				<div>
					<input type="password" name="password" placeholder="비밀번호">
				</div>
				<div>
					<input type="password" name="passwordCheck" placeholder="비밀번호 확인">
				</div>
			</div>
			<div class="buttons">
				<input type="button" name="signUp" value="회원가입">
				<input type="button" name="back"value="돌아가기">
			</div>
		</div>
	</div>
	<jsp:include page="baseJS.jsp" flush="false"/>
	<script src="${pageContext.request.contextPath}/resources/js/signUp.js?version=<%=System.currentTimeMillis() %>"></script>

</body>
</html>
