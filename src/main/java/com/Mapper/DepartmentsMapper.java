package com.Mapper;

import com.Entity.DTO.DepartmentDTO;
import com.Entity.Pojo.Department;
import com.Entity.Pojo.ProcedureResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface DepartmentsMapper {

    /**
     * 查询部门(条件查询)
     * @param departmentDTO
     * @return
     */
    public List<DepartmentDTO> getDepartments(DepartmentDTO departmentDTO);

    /**
     * 添加部门
     * @param departmentDTO
     * @return
     */
    public Integer addDepartment(DepartmentDTO departmentDTO);

    /**
     * 更新部门
     * @param departmentDTO
     * @return
     */
    public ProcedureResult updateDepartment(DepartmentDTO departmentDTO);

    /**
     * 删除部门
     * @param deptId
     * @return
     */
    public int deleteDepartment(String deptId);

    /**
     * 根据Id查询部门
     * @param departmentId
     * @return
     */
    @Select("select * from departments where dept_id=#{departmentId}")
    Department getdepartmentById(String departmentId);
}
