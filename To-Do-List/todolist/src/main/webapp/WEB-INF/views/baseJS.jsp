<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!-- 비동기 동작시 대기화면 생성 -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/waiting.css">
<jsp:include page="waiting.jsp" flush="false"/>

<!-- 제이쿼리, 전역변수 스크립트 , 비동기요청 관려 스크립트(ajax, 대기화면사용, alertResult함수 사용) -->
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/variableJS.jsp?version=<%=System.currentTimeMillis() %>"></script>
<script src="${pageContext.request.contextPath}/resources/js/ajaxRequest.js?version=<%=System.currentTimeMillis() %>"></script>

