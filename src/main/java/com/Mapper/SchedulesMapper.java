package com.Mapper;

import com.Entity.DTO.ScheduleDTO;
import com.Entity.Pojo.Schedule;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;
import java.util.List;

@Mapper
public interface SchedulesMapper {

    /**
     * 查询排班
     * @param scheduleDTO
     * @return
     */
    public List<Schedule> getSchedules(ScheduleDTO scheduleDTO);

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */
    @Insert("")
    public Integer insertSchedules(ScheduleDTO scheduleDTO);

    /**
     * 更新排班
     * @param scheduleDTO
     * @return
     */
    @Update("")
    public Integer updateSchedules(ScheduleDTO scheduleDTO);

    /**
     * 删除排班
     * @param scheduleId
     * @return
     */
    @Delete("")
    public Integer deleteSchedules(String scheduleId);
}
