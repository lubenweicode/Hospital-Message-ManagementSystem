package com.Controller;

import com.Common.Result;
import com.Entity.DTO.DepartmentDTO;
import com.Service.departmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@Slf4j
public class DepartmentsController {

    @Autowired
    private departmentService departmentServiceImpl;

    @GetMapping
    public Result getDepartments(@RequestBody DepartmentDTO departmentDTO) {
        log.info("查询部门,departmentDTO={}", departmentDTO);
        return departmentServiceImpl.getDepartment(departmentDTO);
    }

    @PostMapping
    public Result addDepartment(@RequestBody DepartmentDTO departmentDTO) {
        log.info("添加部门,departmentDTO={}", departmentDTO);
        return departmentServiceImpl.addDepartment(departmentDTO);
    }

    @DeleteMapping("/{departmentId}")
    public Result deleteDepartment(@PathVariable String departmentId) {
        log.info("删除部门,departmentId={}", departmentId);
        return departmentServiceImpl.deleteDepartment(departmentId);
    }

    @PostMapping("/{departmentId}")
    public Result updateDepartment(@PathVariable String departmentId, @RequestBody DepartmentDTO departmentDTO) {
        log.info("根据Id:{},更新部门 departmentDTO={}", departmentId, departmentDTO);
        return departmentServiceImpl.updateDepartment(departmentId, departmentDTO);
    }
}
