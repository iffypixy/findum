import ReactDOM from "react-dom/client";
import * as Toast from "@radix-ui/react-toast";
import {Provider} from "react-redux";
import {Toaster} from "react-hot-toast";

import {store} from "@shared/lib/store";
import {CredentialsLoader} from "@features/auth";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import {SocketManager} from "@shared/lib/ws/socket-manager";
import {App} from "./app";

import "./index.css";

const resources = {
  ru: {
    translation: {
      home: {
        buttons: {
          "create-project": "Создать проект",
          "find-projects": "Найти проект",
        },
        greeting: "Привет, ",
        title: "Лучшие недавние проекты",
      },
      common: {
        founder: "Основатель",
        messages: "Сообщения",
        friends: "Друзья",
        projects: "Проекты",
        settings: "Настройки",
        faq: "ЧЗВ",
        "recent-notifications": "Недавние уведомления",
        "no-notifications": "Нет уведомлений",
        private: "Личные",
        project: "Проекты",
        "my-friends": "Мои друзья",
        "new-friends": "Новые друзья",
        "enter-your-friend-name": "Введи имя друга",
        "you-have-no-friends": "У вас нет друзей",
        "no-friend-requests": "Нет запросов в друзья",
        "delete-the-friend?": "Удалить друга?",
        cancel: "Отменить",
        delete: "Удалить",
        "lets-try-to-find-friends": "Попробуйте найти друзей",
        "my-projects": "Мои проекты",
        "all-projects": "Все проекты",
        owner: "Основатель",
        "go-to-chat": "В чат",
        "no-projects": "Нет проектов",
        specialist: "Специалист",
        country: "Страна",
        city: "Город",
        "projects-were-created1": "проектов",
        "projects-were-created2": "было создано",
        profile: "Профиль",
        "change-password": "Изменить пароль",
        "upload-cv-to": "* Загрузите резюме чтобы отправлять заявки",
        upload: "Загрузить",
        "save-all-changes": "Сохранить изменения",
        "change-password-title": "Изменить ваш пароль",
        "change-password-subtitle": "Введите нынешний и новый пароль",
        "current-password": "Нынешний пароль",
        "new-password": "Новый пароль",
        "confirm-new-password": "Подтвердите новый пароль",
        "document-1": "Документ #1",
        "document-1-subtitle": "Правила оплаты",
        "document-2": "Документ #2",
        "document-2-subtitle": "Правила приватности",
        "create-project": "Создать проект",
        overview: "Главное",
        "start-date": "Дата начала",
        "end-date": "Дата конца",
        "team-members": "Участники проекты",
        requests: "Запросы",
        tasks: "Задачи",
        "no-members": "Нет участников",
        "no-requests": "Нет запросов",
        "no-tasks": "Нет задач",
        edit: "Редактировать",
        "request-investment": "Запросить инвестирование",
        "create-task": "Создать задачу",
        confirm: "Подтвердить",
        date: "Дата",
        time: "Время",
        reviews: "Отзывы",
        "no-projects-yet": "Пока нет проектов",
        "no-reviews-yet": "Пока нет отзывов",
        "edit-profile": "Редактировать профиль",
        "view-resume": "Смотреть резюме",
        "create-project-subtitle":
          "Создайте свою команду для реализации стартап-проекта",
        "sign-in": "Войти",
        "sign-in-subtitle": "Введите данные чтобы войти",
        "auth-title": "Добро пожаловать в сообщество",
        "auth-subtitle":
          "MetaOrta помогает разработчикам создавать организованные и хорошо закодированные информационные панели, полные красивых и многофункциональных модулей. Присоединяйтесь к нам и начните создавать свое приложение уже сегодня.",
        "sign-up": "Войти",
        "sign-up-subtitle": "Введите данные чтобы зарегистрироваться",
        "auth-ad":
          "К нам присоединилось более 10 тысяч человек, теперь ваша очередь",
      },
    },
  },
  en: {
    translation: {
      home: {
        buttons: {
          "create-project": "Create project",
          "find-projects": "Find project",
        },
        greeting: "Hi, ",
        title: "Best recent startup projects",
      },
      common: {
        founder: "Founder",
        messages: "Messages",
        friends: "Friends",
        projects: "Projects",
        settings: "Settings",
        faq: "FAQ",
        "recent-notifications": "Recent notifications",
        "no-notifications": "No notifications",
        private: "Private",
        project: "Project",
        "my-friends": "My friends",
        "new-friends": "New friends",
        "enter-your-friend-name": "Enter your friend name",
        "you-have-no-friends": "You have no friends",
        "no-friend-requests": "No friend requests",
        "delete-the-friend?": "Delete the friend?",
        cancel: "Cancel",
        delete: "Delete",
        "lets-try-to-find-friends":
          "Let’s try to find friends to build connections",
        "my-projects": "My projects",
        "all-projects": "All projects",
        owner: "Owner",
        "go-to-chat": "Go to chat",
        "no-projects": "No projects",
        specialist: "Specialist",
        country: "Country",
        city: "City",
        "projects-were-created1": "project(s)",
        "projects-were-created2": "were created",
        profile: "Profile",
        "change-password": "Change password",
        "upload-cv-to": "* Upload your CV in order to join to teams",
        upload: "Upload",
        "save-all-changes": "Save all changes",
        "change-password-title": "Change your password",
        "change-password-subtitle": "Enter current and new password",
        "current-password": "Current password",
        "new-password": "New password",
        "confirm-new-password": "Confirm new password",
        "document-1": "Document #1",
        "document-1-subtitle": "Payment policy",
        "document-2": "Document #2",
        "document-2-subtitle": "Privacy policy",
        "create-project": "Create project",
        overview: "Overview",
        "start-date": "Start date",
        "end-date": "End date",
        "team-members": "Team members",
        requests: "requests",
        tasks: "tasks",
        "no-members": "No members",
        "no-requests": "No requests",
        "no-tasks": "No tasks",
        edit: "Edit",
        "request-investment": "Request an investment",
        "create-task": "Create task",
        confirm: "Confirm",
        date: "Date",
        time: "Time",
        reviews: "Reviews",
        "no-projects-yet": "No projects yet",
        "no-reviews-yet": "No reviews yet",
        "edit-profile": "Edit profile",
        "view-resume": "View resume",
        "create-project-subtitle":
          "Build up your team to realize startup project",
        "sign-in": "Sign in",
        "sign-in-subtitle": "Please enter your data to sign in",
        "auth-title": "Welcome to our community",
        "auth-subtitle":
          "MetaOrta helps developers to build organized and well coded dashboards full of beautiful and rich modules. Join us and start building your application today.",
        "sign-up": "Sign up",
        "sign-up-subtitle": "Please enter your data to sign up",
        "auth-ad": "More than 10k people joined us, it’s your turn",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <CredentialsLoader>
      <SocketManager>
        <Toaster />

        <Toast.Provider swipeDirection="right">
          <Toast.Viewport className="fixed top-0 right-0 p-10" />

          <App />
        </Toast.Provider>
      </SocketManager>
    </CredentialsLoader>
  </Provider>,
);
