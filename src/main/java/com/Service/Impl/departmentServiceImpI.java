package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.DepartmentDTO;
import com.Entity.Pojo.Department;
import com.Entity.Pojo.ProcedureResult;
import com.Mapper.DepartmentsMapper;
import com.Service.departmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static com.Common.ComDepartment.*;

@Slf4j
@Service
public class departmentServiceImpI implements departmentService {

    @Autowired
    private DepartmentsMapper departmentsMapper;

    @Override
    public Result addDepartment(DepartmentDTO departmentDTO) {
        Result result = new Result();
        Integer flag = departmentsMapper.addDepartment(departmentDTO);
        if(flag == 1) {
            result.setCode(1);
            result.setMsg(MSG_INSERT_DEPARTMENT_SUCCESS);
            result.setData(departmentDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_DEPARTMENT_FAILED);
            result.setData(departmentDTO);
        }
        return result;
    }

    @Override
    public Result getDepartment(DepartmentDTO departmentDTO) {
        Result result = new Result();
        List<DepartmentDTO> departmentList = departmentsMapper.getDepartments(departmentDTO);
        if(departmentList != null && !departmentList.isEmpty()) {
            result.setCode(1);
            result.setMsg(MSG_SELECT_DEPARTMENT_SUCCESS);
            result.setData(departmentList);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_DEPARTMENT_FAILED);
            result.setData(departmentList);
        }
        return result;
    }

    @Override
    public Result updateDepartment(String departmentId,DepartmentDTO departmentDTO) {
        Result result = new Result();
        departmentDTO.setDeptId(departmentId);
        ProcedureResult procedureResult  = departmentsMapper.updateDepartment(departmentDTO);
        if(procedureResult.getMessage().equals("更新成功")) {
            result.setCode(1);
            result.setMsg(MSG_UPDATE_DEPARTMENT_SUCCESS);
            result.setData(departmentDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_UPDATE_DEPARTMENT_FAILED);
            result.setData(departmentDTO);
        }
        return result;
    }

    @Override
    public Result deleteDepartment(String departmentId) {
        Result result = new Result();
        Integer flag = departmentsMapper.deleteDepartment(departmentId);
        if(flag != null) {
            log.info(MSG_DELETE_DEPARTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_DELETE_DEPARTMENT_SUCCESS);
            result.setData(departmentId);
        }else{
            log.info(MSG_DELETE_DEPARTMENT_FAILED);
            result.setCode(0);
            result.setMsg(MSG_DELETE_DEPARTMENT_FAILED);
            result.setData(departmentId);
        }
        return result;
    }

    /**
     * 根据Id查询部门
     * @param departmentId
     * @return
     */
    @Override
    public Result getdepartmentById(String departmentId) {
        Result result = new Result();
        Department department = departmentsMapper.getdepartmentById(departmentId);
        if(department != null) {
            result.setCode(1);
            result.setMsg(MSG_SELECT_DEPARTMENT_SUCCESS);
            result.setData(department);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_DEPARTMENT_FAILED);
            result.setData(department);
        }
        return result;
    }
}
