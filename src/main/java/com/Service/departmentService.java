package com.Service;

import com.Common.Result;
import com.Entity.DTO.DepartmentDTO;


public interface departmentService {

    /**
     * 查询科室(条件查询)
     * @param departmentDTO
     * @return
     */
    Result getDepartment(DepartmentDTO departmentDTO);

    /**
     * 增加科室
     * @param departmentDTO
     * @return
     */
    Result addDepartment(DepartmentDTO departmentDTO);

    /**
     * 根据Id更新科室
     * @param departmentId
     * @param departmentDTO
     * @return
     */
    Result updateDepartment(String departmentId, DepartmentDTO departmentDTO);

    /**
     * 根据Id删除科室
     * @param departmentId
     * @return
     */
    Result deleteDepartment(String departmentId);

    /**
     * 根据Id查询部门
     * @param departmentId
     * @return
     */
    Result getdepartmentById(String departmentId);
}
