 export interface SubmitKudosForm {
    users:      Users;
    type:       Type;
    message:    Message;
    visibility: Visibility;
}

 interface Message {
    "plain_text_input-action": PlainTextInputAction;
}

 interface PlainTextInputAction {
    type:  string;
    value: string;
}

 interface Type {
    "static_select-action": Action;
}

 interface Action {
    type:            string;
    selected_option: SelectedOption;
}

 interface SelectedOption {
    text:  Text;
    value: string;
}

 interface Text {
    type:  string;
    text:  string;
    emoji: boolean;
}

 interface Users {
    "multi_users_select-action": MultiUsersSelectAction;
}

 interface MultiUsersSelectAction {
    type:           string;
    selected_users: string[];
}

 interface Visibility {
    "radio_buttons-action": Action;
}
