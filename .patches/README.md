# Patches

Changes to `.github/workflows/` could not be pushed from the session that
prepared this branch (it lacks the GitHub `workflow` scope), so they are
delivered here as patches. Apply them on top of the branch with:

```sh
git am .patches/*.patch
```

`0001-ci-build.patch` adds `.github/workflows/build.yml`: Node 24.x and 22.x
on `ubuntu-latest`, triggered on push and pull request to `master` and `main`.

beanstalkd note: there is no official beanstalkd image on Docker Hub, and a
GitHub Actions service container cannot override the image command. The
workflow therefore starts the same `alpine:3.24` container as
`docker-compose.yml` with a `docker run` step (host port 11400, health check
`nc -z 127.0.0.1 11300`) and waits until it reports healthy before running
the tests.
