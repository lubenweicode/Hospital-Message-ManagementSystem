package com.Service;

import com.Common.Result;
import com.Entity.DTO.DepartmentDTO;


public interface departmentService {

    /**
     * 查询科室(条件查询)
     * @param departmentDTO
     * @return
     */
    public Result getDepartment(DepartmentDTO departmentDTO);

    /**
     * 增加科室
     * @param departmentDTO
     * @return
     */
    public Result addDepartment(DepartmentDTO departmentDTO);

    /**
     * 根据Id更新科室
     * @param departmentId
     * @param departmentDTO
     * @return
     */
    public Result updateDepartment(String departmentId,DepartmentDTO departmentDTO);

    /**
     * 根据Id删除科室
     * @param departmentId
     * @return
     */
    public Result deleteDepartment(String departmentId);
}
