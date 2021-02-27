<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		.hidden{
			display : none;
		}
	</style>
</head>
<body>
	<div class="content">
		
		<div class="title"> 
			<h1> 마이 페이지</h1>
			<div class="buttons">
				<input id="back" type="button" value="되돌아가기">
			</div> 
		</div>
		
		<div style="text-align : center;">
			메일 : <input id="mail" type="text" value="${result.memberDTO.mail}" readOnly><br>
			이름 : <input id="name" type="text" value="${result.memberDTO.name}" readOnly><br>
			회원가입일 : <input id="signUpDate" type="text" value= "${result.memberDTO.signUpDate}" readOnly><br>
			<input class = "button" id="modifyBase" type="button" value="개인정보수정"> 
			<input class = "button" id="modifyPW" type="button" value="비밀번호변경">
			<input class ="hidden button" id="modifyFin" type="button" value="수정완료">
			 
		</div>
		<div style="text-align: right;">
			<input id="secession" type="button" value="회원탈퇴">
		</div>
	</div>

</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/myInfo.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</html>
