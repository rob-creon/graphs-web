import React from 'react'
import Switch from 'react-switch'
import styles from '../styles/Editor.module.css'

const EditorSwitch = props => {
    const [checked, setChecked] = React.useState(props.initialChecked)

    return (
        <div className={styles.switch_panel}>
            <label>
                <Switch onChange={
                            (c) => {
                                setChecked(c)
                                props.onChange(c)
                            }
                        }
                        checked={checked}
                        onColor={"#8041da"}
                        offColor={"#4a546b"}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className={styles.switch}
                />
                <span className={styles.switch_label}>{props.name}</span>
            </label>
        </div>
    )
}

export default EditorSwitch