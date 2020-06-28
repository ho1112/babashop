import React, { useState } from 'react';
import { Collapse, Radio } from 'antd'

const { Panel } = Collapse;

function RadioBox(props) {

    const [Value, setValue] = useState(0)

    const renderRadiobox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id} >{value.name}</Radio> //Data.js의 _id
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value) //선택한 value를 useState에 넣어준다 -> useState값을 사용하고 있는 Radio.Group의 value가 바뀌면서 라디오버튼이 바뀜
        props.handleFilters(event.target.value) //부모컴포넌트(LandingPage.js)에 전달 
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']} > 
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}> 
                        {renderRadiobox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    );
}

export default RadioBox;