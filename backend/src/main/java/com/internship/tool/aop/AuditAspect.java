package com.internship.tool.aop;

import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

 @After("execution(* com.internship.tool.service.IncidentService.create(..))")
 public void logCreate() {
  System.out.println("AUDIT: Incident created");
 }

 @After("execution(* com.internship.tool.service.IncidentService.update(..))")
 public void logUpdate() {
  System.out.println("AUDIT: Incident updated");
 }

 @After("execution(* com.internship.tool.service.IncidentService.delete(..))")
 public void logDelete() {
  System.out.println("AUDIT: Incident deleted");
 }
}