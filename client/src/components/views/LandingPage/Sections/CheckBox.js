import React from 'react';
import { Collapse, Checkbox } from 'antd'
import { useState } from 'react';


const { Panel } = Collapse;

function CheckBox(props) {
    
    const [Checked, setChecked] = useState([])
    
    const handleToggle = (value) => {
        //체크한 것의 index를 구해 전체 Checked된 State에서 현재 누른 checkox가 있다면 빼주고 State에 넣어준다
        const currentIndex = Checked.indexOf(value) //有:index 無:-1
        const newChecked= [...Checked] //현재 체크된 배열(선택된 체크박스들의 _id)
        if(currentIndex === -1) { //없다면
            newChecked.push(value) //체크된 배열에 넣어준다
        }else{
            newChecked.splice(currentIndex, 1) //이미 있다면 체크배열에서 삭제
        }
        setChecked(newChecked)
        props.handleFilters(newChecked) //부모컴포넌트(LandingPage.js)에 전달 
    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={()=> handleToggle(value._id)} //체크박스id를 전달
            checked={Checked.indexOf(value._id) === -1? false:true} /> 
                <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['1']} >
                <Panel header="This is panel header 1" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    );
}

export default CheckBox;