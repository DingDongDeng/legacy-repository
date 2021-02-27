<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		.wrap-loading{ /*화면 전체를 어둡게 합니다.*/
		    position: fixed;
		    left:0;
		    right:0;
		    top:0;
		    bottom:0;
		    background: rgba(0,0,0,0.2); /*not in ie */
		    filter: progid:DXImageTransform.Microsoft.Gradient(startColorstr='#20000000', endColorstr='#20000000');    /* ie */    
		}
    	.wrap-loading div{ /*로딩 이미지*/
        	position: fixed;
        	top:50%;
        	left:50%;
        	margin-left: -21px;
        	margin-top: -21px;
    	}
    	.display-none{ /*감추기*/
	        display:none;
	    }
	    
	    .content {
	    	text-align: center;
	    }
	    .content input{
	    	
	    	font-size : 2.8em;
	    	width: 40%;
	    	height : 20%;
	    }
	    
		
	</style>
</head>
<body>
	<div class="wrap-loading display-none">
		<div><img src="${pageContext.request.contextPath}/resources/img/loading.gif" /></div>
	</div>
	<div class="content">
		<div class="title">
			<h3>카메라 촬영</h3>
		</div>
		<input id="camera"type="button" value ="촬영하기"></br>
		<input id="take-picture" type="file"  accept="image/*" style="display:none;"></br>
	</div>	 
	

	
</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/camera.js?version=<%=System.currentTimeMillis() %>"></script>

	
</script>
</html>
