package com.board.portfolio.controller;

import com.board.portfolio.domain.dto.CommentDTO;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.service.CommentService;
import com.board.portfolio.validation.anotation.BoardIdExist;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@Validated
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/comment/{boardId}")
    public ResponseEntity getCommentList(@PathVariable @BoardIdExist Long boardId,
                                         @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(commentService.getCommentList(boardId,accountDTO));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PostMapping("/comment/{boardId}")
    public ResponseEntity writeComment(@PathVariable Long boardId,
                                       @RequestBody @Valid CommentDTO.Write dto,
                                       @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(commentService.writeComment(boardId,dto,accountDTO));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PostMapping("/comment/reply")
    public ResponseEntity replyWriteComment(@RequestBody @Valid CommentDTO.Reply dto,
                                            @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(commentService.replyWriteComment(dto,accountDTO));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PutMapping("/comment/{commentId}")
    public ResponseEntity modifyComment(@PathVariable Long commentId,
                                        @RequestBody @Valid CommentDTO.Modify dto,
                                        @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){

        return ResponseEntity.ok(commentService.modifyComment(commentId,dto,accountDTO));
    }
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity deleteComment(@PathVariable Long commentId,
                                        @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){

        return ResponseEntity.ok(commentService.deleteComment(commentId, accountDTO));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PutMapping("/comment/like/{commentId}")
    public ResponseEntity likeComment(@PathVariable Long commentId,
                                      @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){

        return ResponseEntity.ok(commentService.likeComment(commentId, accountDTO));
    }


}
