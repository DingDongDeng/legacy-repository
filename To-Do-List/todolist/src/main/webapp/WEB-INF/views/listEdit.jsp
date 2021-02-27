<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<body>
	<!-- 비동기 동작시 대기화면 생성 -->
	
	<jsp:include page="waiting.jsp" flush="false"/>	
	<div class="listEditPage">
		<div class="inputUI shadow">
			<div class="title">
				<input class="shadow"id="title" type="text" name="title" placeholder="제목 " maxlength="20">
			</div>
			<div class="date">
				<input class="shadow" id="date" type="datetime-local" name="date">
			</div>
			<div class="_content">
				<textarea class="shadow" id="content" maxlength="300"></textarea>
				<span id="counter">###</span>
			</div>
			<div class="buttons">
				<input class="shadow" type="button" name="check" value="확인">
				<input class="shadow" type="button" name="cancel"value="취소">
			</div>
		</div>
	</div>
	<jsp:include page="baseJS.jsp" flush="false"/>
	<script src="${pageContext.request.contextPath}/resources/js/listEdit.js?version=<%=System.currentTimeMillis() %>"></script>

</body>
</html>
