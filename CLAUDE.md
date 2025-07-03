# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This project is for testing a web application using [sqlite-wasm](https://github.com/sqlite/sqlite-wasm) with Vitest. The goal is to verify how to test SQLite WASM applications effectively.

## Architecture Overview

This is a task management application built with sqlite-wasm that uses:

- **SQLite WASM with wrapped worker pattern**: Uses the recommended "main thread with wrapped worker" approach for sqlite-wasm initialization to enable OPFS (Origin Private File System) support
- **sqlite3Worker1Promiser**: The main database client interface (note: lacks TypeScript definitions - see issue #53 in sqlite-wasm repo)
- **Testing Strategy**: Tests actual database operations without mocking, using real database connections (may switch from OPFS to in-memory for test environment)

## Key Implementation Details

### Database Client

- Uses `sqlite3Worker1Promiser` function to create database client
- Reference implementation: https://github.com/sqlite/sqlite-wasm/blob/main/demo/wrapped-worker.js
- TypeScript typing issue tracked at: https://github.com/sqlite/sqlite-wasm/issues/53

### Application Features

Core task management functionality:
- Task registration
- Task deletion
- Task check/uncheck status

### Testing Approach

- Tests backend database operations directly
- No mocking of database layer
- Real database connections used in tests
- Example test pattern focuses on verifying actual database state changes

## Development Setup

Currently no package.json or build configuration files exist. The project structure needs to be initialized with:

- Node.js/npm configuration
- Vitest testing framework
- SQLite WASM dependencies
- TypeScript configuration (if using TypeScript)

## Important Notes

- OPFS support requires the wrapped worker pattern
- Type definitions for sqlite3Worker1Promiser need to be added manually
- Tests should verify actual database operations, not mocked implementations
