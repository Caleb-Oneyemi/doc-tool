# doc-tool

## About
A Q&A system for doctors and patients. There are 3 classes of users: Admins, Staff and Patients. Admins can create and edit questions and send them to patients. Other hospital staff can only view resposes and patients can view questions and send responses to those questions.

## API

### Users

- Create User Endpoint ('/api/users'): It creates an account for a user and stores their details in the db. After creating the account, it sends a confirmation mail to the user's email. It expects a request body like:

```ts
{
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "STAFF" | "PATIENT";
}
```


- Login User Endpoint ('/api/users/login'): It takes in the users credentials and if correct, it returns a jwt token for authenticating the user's requests. The endpoint is protected by a rate limiter middleware that allows only 3 requests in a minute. It expects a request body like:

```ts
{
    password: string;
    email: string;
}
```

- Accout Verification Endpoint ('/api/users/verify/:token'): It verifies the user's account using a request parameter.

### Questions

- Create Question Endpoint ('/api/questions'): Only hospital administrators are allowed to access this endpoint. It creates a question record and expects a request body like:

```ts
{
    title: string;
    sendReminderAfter: number;
    fields: Array<{
        type: "MULTIPLE_CHOICE" | "MULTIPLE_ANSWER" | "FREE_TEXT";
        text: string;
        options?: string[] | undefined;
    }>;
}
```

- Update Question Endpoint ('/api/questions/:id'): Only hospital administrators are allowed to access this endpoint. Only the admin that created the question is allowed to edit it. It updates a question record and expects a request body like:

```ts
{
    title?: string | undefined;
    sendReminderAfter?: number | undefined;
    fields?: Array<{
        type: "MULTIPLE_CHOICE" | "MULTIPLE_ANSWER" | "FREE_TEXT";
        text: string;
        options?: string[] | undefined;
    }> | undefined;
}
```

- Send Question To Patient Endpoint  ('/api/questions/:id/send/:patientId'): Only hospital administrators are allowed to access this endpoint. Only the admin that created the question is allowed to send it to a patient. It creates a Response record using the patientId and questionId and it also sets the due date based on the sendReminderAfter of a question. The sendReminderAfter value is an integer value representing the number of hours after which a patient would recieve a reminder if they have not completed a question response. After creating the Response record, it sends an email notification to the client alerting them of the new question sent to them.

- Get Question Endpoint ('/api/questions/:id'): All users are allowed to access this endpoint. All it does is return a question using the id.

### Responses

- Send Response Endpoint ('/responses/:id/send'): Only patients are allowed to access this endpoint. It first looks for a pending response with the id param for the logged in user. If the response exists, it does some checks to ensure it makes sense for the question and if it does, it formats the response, updates it in the db and notifies the admin of the response.

```ts
{
    fields: Array<{
        text: string;
    } | {
        options?: string[] | undefined;
    }>;
}
```

- Get Response Endpoint ('/responses/:id'): Only hospital admins and staff are allowed to access this. It simply returns the response long with the question details.

- Get Responses Endpoint ('/responses'): Only hospital admins and staff are allowed to access this. It simply returns a paginated response list. The following query parameters are optionally accepted to modify the results.


```ts
{
    page?: number | undefined;
    limit?: number | undefined;
    sort?: "asc" | "desc" | undefined;
    status?: "PENDING" | "COMPLETED" | undefined;
    owner?: string | undefined;
}
```


## Jobs:

- A cron job is run hourly to remind patients about the questions they haven't answered. If there is a pending response with a due date that falls within the current time and one hour ago, the job will send a reminder to that patient via mail.
