package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.DepartmentDTO;
import com.Entity.Pojo.Department;
import com.Mapper.DepartmentsMapper;
import com.Service.departmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComDepartment.*;

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
        List<Department> departmentList = departmentsMapper.getDepartments(departmentDTO);
        if(departmentList != null && departmentList.size() > 0) {
            result.setCode(1);
            result.setMsg(MSG_SELECT_DEPARTMENT_SUCCESS);
            result.setData(departmentDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_DEPARTMENT_FAILED);
            result.setData(departmentDTO);
        }
        return result;
    }

    @Override
    public Result updateDepartment(String departmentId,DepartmentDTO departmentDTO) {
        Result result = new Result();
        Integer flag = departmentsMapper.updateDepartment(departmentId,departmentDTO);
        if(flag != null) {
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
            result.setCode(1);
            result.setMsg(MSG_DELETE_DEPARTMENT_SUCCESS);
            result.setData(departmentId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_DELETE_DEPARTMENT_FAILED);
            result.setData(departmentId);
        }
        return result;
    }
}
