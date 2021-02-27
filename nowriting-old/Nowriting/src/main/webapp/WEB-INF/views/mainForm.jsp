<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<meta charset="utf-8"/>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/includeCSS/mainForm.css?version=<%=System.currentTimeMillis() %>">	
</head>
<body background = "${pageContext.request.contextPath}/resources/img/wood-3271749_1920.jpg">
	<div class="whole">
		<div class="header">
			<jsp:include page="includeJSP/title.jsp" flush="false"/>
		</div>
		<div class="body">
			<div class="contents">
				<div class="function">
					<jsp:include page="${viewName}.jsp" flush="false"/>
				</div>
				<div class="explain">
					<jsp:include page="${viewName}Explain.jsp" flush="false"/>
				</div>
			</div>
		</div>
		<div class="footer">
		
		</div>
	</div>
	<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
	<script type="text/javascript"></script>
</body>
</html>