.PHONY: install seed run test clean

install:
	pip install -r backend/requirements.txt
	pip install pytest httpx

seed:
	python -m backend.seed

run:
	python -m backend.run

test:
	pytest backend/tests/ -v

clean:
	rm -f backend/database.db backend/test_demo.db
	rm -rf __pycache__ backend/__pycache__ backend/**/__pycache__
