package com.Mapper;

import com.Entity.DTO.DepartmentDTO;
import com.Entity.Pojo.Department;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DepartmentsMapper {

    /**
     * 查询部门(条件查询)
     * @param departmentDTO
     * @return
     */
    public List<Department> getDepartments(DepartmentDTO departmentDTO);

    /**
     * 添加部门
     * @param departmentDTO
     * @return
     */
    public Integer addDepartment(DepartmentDTO departmentDTO);

    /**
     * 更新部门
     * @param departmentId
     * @param departmentDTO
     * @return
     */
    public Integer updateDepartment(String departmentId, DepartmentDTO departmentDTO);

    /**
     * 删除部门
     * @param departmentId
     * @return
     */
    public Integer deleteDepartment(String departmentId);

    /**
     * 根据Id查询部门
     * @param departmentId
     * @return
     */
    @Select("select * from departments where dept_id=#{departmentId}")
    Department getdepartmentById(String departmentId);
}
