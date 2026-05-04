package com.internship.tool.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

 @PostMapping("/analyze")
 public String analyze(@RequestBody Map<String, String> body) {

  String prompt = body.get("prompt");

  return "AI Analysis:\n\n" +
         "Input: " + prompt + "\n\n" +
         "• Possible issue detected\n" +
         "• Check logs\n" +
         "• Restart service if needed";
 }
}