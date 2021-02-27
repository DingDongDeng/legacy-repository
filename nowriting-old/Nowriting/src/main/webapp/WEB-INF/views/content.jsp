<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<title></title>
	<style>		
		._content {
			text-align : center;
		}
		._content textarea{
			float:left;
			margin-top: 15px;
			width : 400px;
			height : 500px;
			
		}
		.controll input[type=text]{
			width : 60px;
		}
		
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
	    
	    .controll input{
	    	width:32px;
	    	height:32px;
	    	padding : 0px;
	    	border : 0px;
	    }
	    #camera{
	    	background: url("${pageContext.request.contextPath}/resources/img/photo.png" ) no-repeat;
	    }
	    #save{
	    	background: url("${pageContext.request.contextPath}/resources/img/save.png" ) no-repeat;
	    }
	    #delete{
	    	background: url("${pageContext.request.contextPath}/resources/img/delete.png" ) no-repeat;
	    }
	    #left{
	    	margin-left: calc(50% - 232px);
	    	background: url("${pageContext.request.contextPath}/resources/img/left-arrow.png" ) no-repeat;
	    }
	    #right{
	    	background: url("${pageContext.request.contextPath}/resources/img/right-arrow.png" ) no-repeat;
	    }
	    #move{
	    	background: url("${pageContext.request.contextPath}/resources/img/search.png" ) no-repeat;
	    }
	    
	    .right-left{
	    	float:left;
	    	margin-top : 200px;
	    } 
	    
	  
	</style>
</head>
<body>
<div class="wrap-loading display-none">
		<div><img src="${pageContext.request.contextPath}/resources/img/loading.gif" /></div>
</div> 
<div class="content">
	<div class="title">
		<h3 id="pName"> ${content.pName}</h3>
		<div class="buttons">
			<input id="back" type="button" value="되돌아가기">
		</div>		
		<span class="display-none">
			ID : <span id="pId">${content.pId}</span>
		</span>
	</div>
	<div class="_content">
		<span>
			<div>
				<span class="controll">
					<input class="right-left" id="left" type="button" >
				</span>
				<textarea id="content">${content.contentDTO.content}</textarea>
				<span class="controll">
					<input class="right-left" id="right" type="button">
				</span>
			</div>
			<div class="controll">
				<div style="margin-top : 5px; margin-bottom : 5px;">
					<span>
						<div>
							<input id="page" style="text-align:center;border:3px solid black;"type="text" placeholder="page">
						</div>
						<div style="margin-top:-32px; margin-right:-96px">
							<input id="move" type="button">
						</div>
					</span>
				</div>
				<div>
					<span>
						<input id="camera" type="button">
						<input id="take-picture" type="file"  accept="image/*" style="display:none;">
						<input id="save" type="button" >
						<input id="delete" type="button">
					</span>					
				</div>
				
			</div>
			<div style="font-weight:bold;text-align: center; margin-top: 450px;">
				<span id="nowPage">${content.contentDTO.page}</span><h4 style="display:inline;">Page</h4>					
			</div>
		</span>
		
	</div>
		
</div>

</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/content.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</html>
