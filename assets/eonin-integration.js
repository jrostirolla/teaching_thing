// this module interacts with the Eonin server to pull down lesson objects

(function() {
    const apiServerUrl = "https://api.eonin.io/api/v1/rest/";
    const apiAccessKey = "ck8SktomKBuEIKigohTKii8F9QIGwoj58nO8a2dEJVQq0oy8LR";

    async function fetchLesson(lessonId) {
        // fetch lesson by lessonID, and activities in parallel
        const [lesson, allActivities] = await Promise.all([
            fetchEoninLesson(lessonId),
            fetchEoninActivities()
        ]);

        // collate all activity IDs from Eonin object
        const lessonActivities = [
            lesson.activity1.entityId,
            lesson.activity2.entityId,
            lesson.activity3.entityId,
            lesson.activity4.entityId,
            lesson.activity5.entityId,
            lesson.activity6.entityId,
            lesson.activity7.entityId,
            lesson.activity8.entityId
        ]
            // filter out any null activities
            .filter(activityId => activityId !== null)
            // map ID to full activity object
            .map(activityId => allActivities.find(x => x.id === activityId));

        // produce new lesson object
        return {
            id: lesson.id,
            name: lesson.name,
            activities: lessonActivities
        };
    }

    // expose function globally
    window.fetchLesson = fetchLesson;

    // private helper functions
    async function fetchEoninLesson(lessonId) {
        return await makeEoninRequest(`lessons/${lessonId}`);
    }

    async function fetchEoninActivities() {
        const activitiesQuery = await makeEoninRequest("activities");
        return activitiesQuery.results;
    }

    async function makeEoninRequest(url) {
        const response = await axios.request({
            method: "get",
            url: apiServerUrl + url,
            headers: {
                'Authorization': 'Bearer ' + apiAccessKey
            }
        });

        return response.data
    }
})();