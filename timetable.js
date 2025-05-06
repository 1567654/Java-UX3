
const app = {}
const grid = {
    template: `<div class="employees">
                    <div v-for="employee in employees">
                        <h5>{{employee.name}}<h5>
                        <br>
                        {{employee.proffesion[0]}}/{{employee.proffesion[1]}}
                    </div>
                </div>
                `
}
const vueApp = Vue.createApp(app)
vueApp.component("grid", grid)
vueApp.mount(".timetable")

const employees = [
    {
        name: "Anna",
        proffesion: ["Snickare", "Målare"]
    },
    {
        name: "Bert",
        proffesion: ["Rörmokare"]
    },
    {
        name: "Carl",
        proffesion: ["Snickare", "Målare"]
    },
    {
        name: "Dennis",
        proffesion: ["Snickare", "Målare"]
    },
    {
        name: "Erik",
        proffesion: ["Murare"]
    },
    {
        name: "Fredrika",
        proffesion: ["Snickare", "Målare"]
    },
    {
        name: "Göran",
        proffesion: ["Murare"]
    },
    {
        name: "Harald",
        proffesion: ["Elektriker"]
    },
    {
        name: "Ivar",
        proffesion: ["Snickare"]
    },
    {
        name: "Jonas",
        proffesion: ["Rörmokare"]
    },
    {
        name: "Katarina",
        proffesion: ["Målare"]
    },
    {
        name: "Lars",
        proffesion: ["Elektriker"]
    },
    {
        name: "Mona",
        proffesion: ["Snickare"]
    }
]
