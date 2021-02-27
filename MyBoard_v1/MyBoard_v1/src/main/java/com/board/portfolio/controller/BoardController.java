package com.board.portfolio.controller;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/board/{page}")
    public ResponseEntity getBoardList(@PathVariable int page){
        return ResponseEntity.ok(boardService.getPaginBoardList(page));
    }

    @GetMapping("/board/search/{page}")
    public ResponseEntity getSearchBoardList(@PathVariable int page,
                                             @Valid BoardDTO.Search dto){
        return ResponseEntity.ok(boardService.getPaginSearchBoardList(page,dto));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PostMapping("/board")
    public ResponseEntity writePost(@Valid BoardDTO.Write dto,
                                    @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        boardService.writePost(dto, accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }
    @GetMapping("/board/post/{boardId}")
    public ResponseEntity readPost(@PathVariable Long boardId,
                                   @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(boardService.readPost(boardId,accountDTO));
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PostMapping("/board/like")
    public ResponseEntity likePost(@RequestBody @Valid BoardDTO.Like dto,
                                   @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        return ResponseEntity.ok(boardService.likePost(dto,accountDTO));
    }

    @GetMapping("/board/file/{fileId}")
    public void download(@PathVariable String fileId, HttpServletResponse res){
        boardService.download(res,fileId);
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @DeleteMapping("/board/{boardId}")
    public ResponseEntity deletePost(@PathVariable Long boardId,
                                     @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        boardService.deletePost(boardId,accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }

    @PreAuthorize("hasRole('ROLE_MEMBER')")
    @PutMapping("/board/{boardId}")
    public ResponseEntity updatePost(@PathVariable Long boardId,
                                     @Valid BoardDTO.Update dto,
                                     @ModelAttribute("accountDTO") AccountSecurityDTO accountDTO){
        boardService.updatePost(boardId, dto, accountDTO);
        return ResponseEntity.ok(Result.SUCCESS);
    }
}
