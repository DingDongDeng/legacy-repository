<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/includeCSS/title.css?version=<%=System.currentTimeMillis() %>">
	</head>
	<body>
		<div class="title">
			<h1>Nowriting</h1>
			<div class="buttons">
				<input id="logout" type="button" value ="로그아웃">
				<input id="myInfo" type="button" value = "내 정보"><br>
			</div>
		</div>
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script src="${pageContext.request.contextPath}/resources/js/variableJS.jsp?version=<%=System.currentTimeMillis() %>"></script>
		<script src="${pageContext.request.contextPath}/resources/js/title.js?version=<%=System.currentTimeMillis() %>"></script>
	</body>
</html>

