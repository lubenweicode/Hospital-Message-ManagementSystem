package com.Mapper;

import com.Entity.DTO.ScheduleDTO;
import com.Entity.Pojo.Schedule;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SchedulesMapper {

    /**
     * 查询排班
     * @param scheduleDTO
     * @return
     */
    public List<ScheduleDTO> getSchedules(ScheduleDTO scheduleDTO);

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */

    public Integer insertSchedule(ScheduleDTO scheduleDTO);

    /**
     * 更新排班
     * @param scheduleDTO
     * @return
     */
    public Integer updateSchedule(ScheduleDTO scheduleDTO);

    /**
     * 删除排班
     * @param scheduleId
     * @return
     */
    public Integer deleteSchedules(String scheduleId);

    @Select("select * from schedules where schedule_id=#{scheduleId}")
    ScheduleDTO getschedulesById(String scheduleId);

    @Select("select * from schedules where doctor_id=#{doctorId}")
    List<ScheduleDTO> getschedulesByDoctorId(String doctorId);
}
